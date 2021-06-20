# Bem-vindo à (breve) documentação do nosso TCC

### Trabalho de conclusão de curso em Desenvolvimento de Sistemas na ETEC Jd. Angela

_________________________
Para executar a aplicação: <br>

- Após baixar os arquivos, executar no terminal:

```npm install```

- Ir no arquivo app.js e mudar as credenciais de host, user, password e database (linhas 13 a 16):

```
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
```

- Feito isso, executar o comando ```npm start```.

Se tudo foi feito corretamente, aparecerá no terminal a seguinte mensagem: 

````
Servidor iniciado na porta 3333.
Conectado ao MYSQL!
````