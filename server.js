import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.use(cors());

app.get('/usuarios', async (req, res) => {

    const users = await prisma.user.findMany();
    res.status(200).json(users);

});

app.post('/usuarios', async (req, res) => {

    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
      },
    })
    res.status(201).json(user) 
});

app.put('/usuarios/:id', async (req, res) => {
    const user = await prisma.user.update({
      where: {
        id: req.params.id
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
      } 
    })
    res.status(200).json(user)
});

app.delete('/usuarios/:id', async (req, res) => {
 await prisma.user.delete({
      where: {
        id: req.params.id
      },
    })
    res.status(200).json({ message: 'Usuário deletado com sucesso!' })
});

app.listen(3000);
/*
-rafaelxavi277_db_user
-Y3bHSlAYBAN6ohOj
-*/