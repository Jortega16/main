require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting basic implementation (optional but recommended)
// Skipped external lib to keep dependencies minimal per plan.

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Swagger Options
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'J4Soluciones API',
            version: '1.0.0',
            description: 'API para el sitio corporativo de J4Soluciones',
            contact: {
                name: 'J4Soluciones',
                email: 'contacto@j4soluciones.com'
            }
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Servidor Local'
            }
        ]
    },
    apis: ['./index.js'], // Files containing annotations
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Enviar formulario de contacto
 *     tags: [Contacto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del contacto (min 2 caracteres)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico válido
 *               company:
 *                 type: string
 *                 description: Nombre de la empresa (opcional)
 *               message:
 *                 type: string
 *                 description: Mensaje de contacto (min 10 caracteres)
 *     responses:
 *       200:
 *         description: Mensaje enviado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Error al enviar el mensaje
 */
app.post("/api/contact", async (req, res) => {
  const { name, email, company, message } = req.body;

  // Validation
  const errors = [];
  if (!name || name.length < 2)
    errors.push("El nombre es requerido y debe tener al menos 2 caracteres.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push("El correo es requerido y debe ser válido.");
  if (!message || message.length < 10)
    errors.push("El mensaje es requerido y debe tener al menos 10 caracteres.");

  if (errors.length > 0) {
    return res
      .status(400)
      .json({ success: false, message: "Datos inválidos", errors });
  }

  // Email content
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO,
    subject: "Nuevo contacto desde J4Soluciones",
    text: `
Nombre: ${name}
Email: ${email}
Empresa: ${company || "N/A"}

Mensaje:
${message}
        `,
    html: `
            <h3>Nuevo contacto desde J4Soluciones</h3>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Empresa:</strong> ${company || "N/A"}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
        `,
  };

  // Send email
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al enviar el mensaje" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
