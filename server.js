import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();

// Middleware to log raw request body for debugging JSON parsing errors
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      console.log('Raw request body:', body);
      req.rawBody = body;
      next();
    });
  } else {
    next();
  }
});

app.use(express.json());

app.use(cors());

app.get('/usuarios', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.post('/usuarios', async (req, res) => {
  try {
    if (!req.body.email || !req.body.name) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
    }
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
      }
    });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email já cadastrado.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.put('/usuarios/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: req.params.id
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
      }
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
/*
-rafaelxavi277_db_user
-Y3bHSlAYBAN6ohOj
-*/