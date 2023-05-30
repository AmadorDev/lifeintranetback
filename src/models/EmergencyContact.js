const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const ContactoEmergencySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    name: { type: String, maxLength: 25,require:true },
    phone: { type: String, maxLength: 10 ,require:true},
  },
  { timestamps: true }
);
// usando validator
// ContactoEmergencySchema.plugin(uniqueValidator, { message: "{PATH} debe ser unico" });

const EmergencyContact = model(
  "contacts_emergency",
  ContactoEmergencySchema
);

module.exports = EmergencyContact;
