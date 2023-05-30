const nodemailer = require("nodemailer");
const fs = require("fs")
const sendEmail = async(url,filename,subject='',content='') => {
  let transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { 
      rejectUnauthorized: false 
  }
  });
  let message = {};
  if(url != null){
     message = {
        from: process.env.EMAIL_FROM,
        to:process.env.EMAIL_TO,
        subject: subject, 
        html: content,
        attachments: [
          {
            filename: filename,
            path: url,
          },
        ],
      };
  }else{
     message = {
        from: process.env.EMAIL_FROM,
        to:process.env.EMAIL_TO,
        subject: subject, 
        html: content,
      };
  }
  
  

 
  
  return await transport.sendMail(message)
};


const removeFile = (filename)=>{
    let path = `src/public/filesforms/${filename}`;
    try {
      fs.unlinkSync(path);
      console.log("LOG: revome File")
    } catch (err) {
        console.log("LOG: Not revome File")
        console.log(err)
    }
}

module.exports = {sendEmail, removeFile}