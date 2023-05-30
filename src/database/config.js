let database;
if (process.env.NODE_ENV === "dev") {
  database = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`;
} else {
  // database = `mongodb://uxdcqs6hfab6xafpjlf0:sgzUoEOkDHxTgpQGsgU4@bj5uousiieix0j0-mongodb.services.clever-cloud.com:27017/bj5uousiieix0j0`;
  database = `mongodb://${process.env.DB_USER}:${encodeURIComponent(
    process.env.DB_PASS
  )}@${process.env.DB_HOST}:${process.env.DB_PORT}/${
    process.env.DB_NAME
  }?authSource=admin`;
}

module.exports = database;
