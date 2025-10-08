-- Consulta para visualizar todos os alunos cadastrados
SELECT 
    id,
    name as Nome,
    email as Email,
    role as Função,
    active as Ativo,
    createdAt as Data_Cadastro
FROM users 
WHERE role = 'ALUNO'
ORDER BY createdAt DESC;