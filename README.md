# Crash Game

## Objetivo

Desenvolver um crash game com arquitetura de microserviços, autenticação centralizada e engine de jogo em tempo real.

## Como rodar

A execução da aplicação é simples e direta:

1. Configure as variáveis de ambiente em cada serviço. Crie um arquivo `.env` em `frontend`, `services/games` e `services/wallets` utilizando os arquivos `.env.example` como base.

2. Execute o comando abaixo:

```bash
pnpm docker:up
```

Após o build ser concluído, a aplicação estará disponível em **http://localhost:3000**

**Observação 1:** Aguarde alguns minutos após a conclusão do `docker up`, pois as APIs ainda estarão executando migrations no banco de dados.

**Observação 2:** Para usuários Windows, pode haver problemas com o PostgreSQL. Execute o seguinte comando na raiz do projeto para resolver:

```powershell
(Get-Content "docker/postgres/init-databases.sh" -Raw).Replace("`r`n","`n") | Set-Content "docker/postgres/init-databases.sh" -NoNewline
```

## Referências

As seguintes referências foram utilizadas no desenvolvimento:

- Tutorial de Crash Game (conceitos e mecânicas)
- Testes práticos em plataforma de crash game em produção

## Arquitetura

### Engine do Jogo

A engine de crash opera em memória e é inicializada uma única vez ao startup do servidor. Ela é responsável por:

- Gerenciar o timer do jogo
- Processar eventos e cálculos de crash
- Manter o loop infinito de execução sem bloquear o sistema (operação assíncrona em JavaScript)

Redis foi integrado para otimizar a precisão do cashout, permitindo capturar o timestamp exato no momento do saque do usuário. Inicialmente, havia a intenção de utilizar Redis para persistir os dados da engine, porém esta funcionalidade não foi implementada no escopo atual.

### Padrão de Arquitetura (DDD)

O projeto implementa Domain-Driven Design com uma abordagem customizada:

- **Rotas de Escrita:** Para endpoints com lógica de negócio complexa, utiliza-se o padrão Entity + Repository, garantindo integridade e consistência dos dados.

- **Rotas de Leitura:** Para operações de consulta, utiliza-se diretamente Query Pattern, otimizando a performance ao buscar apenas os dados necessários sem overhead de mapeamento.

Esta separação permite melhor performance nas leituras sem comprometer a segurança das operações de escrita.