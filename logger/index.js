const { createLogger, format, transports } = require("winston");
const path = require("path");
//=========================================================================================================================================

module.exports = createLogger({
  transports: [
    new transports.File({
      level: "info",
      handleExceptions: true,
      maxFiles: 10,
      maxsize: 10000000,
      filename: path.resolve("logs", "server.log"),
      format: format.combine(
        format.timestamp({ format: "MM-DD-YYYY HH:mm:ss" }),
        format.align(),
        format.printf(
          (info) => `--${info.level}: ${[info.timestamp]}${info.message}--`
        )
      ),
    }),
    new transports.Console({
      level: "debug",
      handleExceptions: true,
      format: format.combine(
        format.timestamp({ format: "MM-DD-YYYY HH:mm:ss" }),
        format.simple(),
        format.colorize({ all: true }),
        format.printf(
          (info) => `${info.level}: ${[info.timestamp]} ${info.message}`
        )
      ),
    }),
  ],
});
