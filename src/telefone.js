import { Router } from "express";
import autenticarToken from "./autenticacao.js";

export default function Telefone(app, db) {

    const router = Router();

    /**
     * @swagger
     * /Telefone/{idTelefone}:
     *   get:
     *     summary: Busca um telefone pelo ID
     *     tags:
     *       - Telefone
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idTelefone
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do telefone
     *     responses:
     *       200:
     *         description: Telefone encontrado
     *       404:
     *         description: Telefone não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    router.get(
        "/Telefone/:idTelefone",
        autenticarToken,
        async (req, res) => {

            try {

                const { idTelefone } = req.params;

                const sql = `
                    SELECT *
                    FROM Telefone
                    WHERE idTelefone = ?
                `;

                const [rows] = await db.query(
                    sql,
                    [idTelefone]
                );

                if (rows.length === 0) {

                    return res.status(404).json({
                        erro: "Telefone não encontrado"
                    });

                }

                res.status(200).json(rows[0]);

            } catch (error) {

                console.error(error);

                res.status(500).json({
                    erro: "Erro na consulta ao banco de dados"
                });

            }

        }
    );


    /**
     * @swagger
     * /ListaTelefones:
     *   get:
     *     summary: Lista todos os telefones cadastrados
     *     tags:
     *       - Telefone
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de telefones retornada com sucesso
     *       500:
     *         description: Erro interno do servidor
     */
    router.get(
        "/ListaTelefones",
        autenticarToken,
        async (req, res) => {

            try {

                const sql = `
                    SELECT *
                    FROM Telefone
                `;

                const [rows] = await db.query(sql);

                res.status(200).json(rows);

            } catch (error) {

                console.error(error);

                res.status(500).json({
                    erro: "Erro na consulta ao banco de dados"
                });

            }

        }
    );


    /**
     * @swagger
     * /IncluirTelefone:
     *   post:
     *     summary: Cadastra um novo telefone
     *     tags:
     *       - Telefone
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - Telefone
     *             properties:
     *               Telefone:
     *                 type: string
     *                 example: "999999999"
     *               DDD:
     *                 type: string
     *                 example: "51"
     *               idTipoTelefone:
     *                 type: integer
     *                 example: 1
     *     responses:
     *       201:
     *         description: Telefone cadastrado com sucesso
     *       400:
     *         description: Dados obrigatórios não informados
     *       500:
     *         description: Erro ao cadastrar telefone
     */
    router.post(
        "/IncluirTelefone",
        autenticarToken,
        async (req, res) => {

            try {

                const {
                    Telefone,
                    DDD,
                    idTipoTelefone
                } = req.body;


                if (!Telefone) {

                    return res.status(400).json({
                        erro: "Campo Telefone é obrigatório"
                    });

                }


                const sql = `
                    INSERT INTO Telefone
                    (
                        Telefone,
                        DDD,
                        idTipoTelefone
                    )
                    VALUES (?, ?, ?)
                `;


                const [result] = await db.query(
                    sql,
                    [
                        Telefone,
                        DDD,
                        idTipoTelefone
                    ]
                );


                res.status(201).json({

                    mensagem:
                        "Telefone cadastrado com sucesso",

                    idTelefone:
                        result.insertId

                });


            } catch (error) {

                console.error(error);

                res.status(500).json({

                    erro:
                        "Erro ao cadastrar telefone no banco de dados"

                });

            }

        }
    );


    /**
     * @swagger
     * /AlterarTelefone/{idTelefone}:
     *   put:
     *     summary: Altera os dados de um telefone pelo ID
     *     tags:
     *       - Telefone
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idTelefone
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do telefone
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               Telefone:
     *                 type: string
     *                 example: "999999999"
     *               DDD:
     *                 type: string
     *                 example: "51"
     *               idTipoTelefone:
     *                 type: integer
     *                 example: 1
     *     responses:
     *       200:
     *         description: Telefone alterado com sucesso
     *       400:
     *         description: Nenhum campo fornecido para atualização
     *       404:
     *         description: Telefone não encontrado
     *       500:
     *         description: Erro ao alterar telefone
     */
    router.put(
        "/AlterarTelefone/:idTelefone",
        autenticarToken,
        async (req, res) => {

            try {

                const { idTelefone } = req.params;

                const {
                    Telefone,
                    DDD,
                    idTipoTelefone
                } = req.body;


                const campos = [];
                const valores = [];


                if (Telefone !== undefined) {

                    campos.push("Telefone = ?");
                    valores.push(Telefone);

                }


                if (DDD !== undefined) {

                    campos.push("DDD = ?");
                    valores.push(DDD);

                }


                if (idTipoTelefone !== undefined) {

                    campos.push("idTipoTelefone = ?");
                    valores.push(idTipoTelefone);

                }


                if (campos.length === 0) {

                    return res.status(400).json({

                        erro:
                            "Nenhum campo fornecido para atualização"

                    });

                }


                const sql = `
                    UPDATE Telefone
                    SET ${campos.join(", ")}
                    WHERE idTelefone = ?
                `;


                valores.push(idTelefone);


                const [result] = await db.query(
                    sql,
                    valores
                );


                if (result.affectedRows === 0) {

                    return res.status(404).json({

                        erro:
                            "Telefone não encontrado"

                    });

                }


                res.status(200).json({

                    mensagem:
                        "Telefone alterado com sucesso"

                });


            } catch (error) {

                console.error(error);

                res.status(500).json({

                    erro:
                        "Erro ao alterar telefone no banco de dados"

                });

            }

        }
    );


    /**
     * @swagger
     * /ExcluirTelefone/{idTelefone}:
     *   delete:
     *     summary: Exclui um telefone pelo ID
     *     tags:
     *       - Telefone
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idTelefone
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do telefone
     *     responses:
     *       200:
     *         description: Telefone excluído com sucesso
     *       404:
     *         description: Telefone não encontrado
     *       500:
     *         description: Erro ao excluir telefone
     */
    router.delete(
        "/ExcluirTelefone/:idTelefone",
        autenticarToken,
        async (req, res) => {

            try {

                const { idTelefone } = req.params;


                const sql = `
                    DELETE FROM Telefone
                    WHERE idTelefone = ?
                `;


                const [result] = await db.query(
                    sql,
                    [idTelefone]
                );


                if (result.affectedRows === 0) {

                    return res.status(404).json({

                        erro:
                            "Telefone não encontrado"

                    });

                }


                res.status(200).json({

                    mensagem:
                        "Telefone excluído com sucesso"

                });


            } catch (error) {

                console.error(error);

                res.status(500).json({

                    erro:
                        "Erro ao excluir telefone do banco de dados"

                });

            }

        }
    );


    app.use("/", router);

}