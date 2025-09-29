import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { StatusCodes } from 'http-status-codes';

describe('FakeStore API', () => {
    const p = pactum;
    const rep = SimpleReporter;
    const baseUrl = 'https://fakestoreapi.com';

    p.request.setDefaultTimeout(90000);

    beforeAll(async () => {
        p.reporter.add(rep);
    });

    describe('Produtos', () => {
        it('Retorna um produto', async () => {
            await p
                .spec()
                .get(`${baseUrl}/products/1`)
                .expectStatus(StatusCodes.OK)
                .expectJsonSchema({
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        title: { type: 'string' },
                        price: { type: 'number' },
                        description: { type: 'string' },
                        category: { type: 'string' },
                    },
                });
        });

        it('Retorna todos os produtos', async () => {
            await p
                .spec()
                .get(`${baseUrl}/products`)
                .expectStatus(StatusCodes.OK)
                .expectJsonSchema({
                    type: 'array'
                });
        });

        it('Retorna uma lista limitada de produtos', async () => {
            await p
                .spec()
                .get(`${baseUrl}/products?limit=5`)
                .expectStatus(StatusCodes.OK)
                .expectJsonLength(5);
        });

        it('Adiciona um novo produto', async () => {
            const requestBody = {
                title: 'Produto de Teste',
                price: 15.5,
                description: 'lorem ipsum set',
                image: 'https://i.pravatar.cc',
                category: 'electronic'
            };
            await p
                .spec()
                .post(`${baseUrl}/products`)
                .withJson(requestBody)
                .expectStatus(StatusCodes.CREATED)
                .expectJsonLike({
                    id: /\d+/,
                    title: 'Produto de Teste'
                });
        });
        
        it('Atualiza um produto', async () => {
            const requestBody = {
                title: 'Produto Atualizado',
                price: 20.0,
                description: 'nova descrição',
                image: 'https://i.pravatar.cc',
                category: 'jewelery'
            };
            await p
                .spec()
                .put(`${baseUrl}/products/7`)
                .withJson(requestBody)
                .expectStatus(StatusCodes.OK)
                .expectJsonLike({
                    id: 7,
                    title: 'Produto Atualizado'
                });
        });

        it('Deleta um produto', async () => {
            await p
                .spec()
                .delete(`${baseUrl}/products/6`)
                .expectStatus(StatusCodes.OK)
                .expectJsonLike({
                    id: 6
                });
        });
        
        it('Retorna todas as categorias', async () => {
            await p
                .spec()
                .get(`${baseUrl}/products/categories`)
                .expectStatus(StatusCodes.OK)
                .expectJsonSchema({ type: 'array' });
        });
    });


    describe('Usuários', () => {
        it('Retorna todos os usuários', async () => {
            await p
                .spec()
                .get(`${baseUrl}/users`)
                .expectStatus(StatusCodes.OK)
                .expectJsonSchema({ type: 'array' });
        });
        
        it('Retorna um usuário específico', async () => {
            await p
                .spec()
                .get(`${baseUrl}/users/2`)
                .expectStatus(StatusCodes.OK)
                .expectJsonLike({
                    id: 2,
                    username: 'mor_2314'
                });
        });
    });

    describe('Autenticação', () => {
        it('Realiza o login com sucesso', async () => {
            const credentials = {
                username: 'mor_2314',
                password: '83r5^_'
            };
            await p
                .spec()
                .post(`${baseUrl}/auth/login`)
                .withJson(credentials)
                .expectStatus(StatusCodes.CREATED)
                .expectJsonSchema({
                    type: 'object',
                    properties: {
                        token: { type: 'string' }
                    }
                });
        });

        it('Falha ao tentar logar com senha inválida', async () => {
            const credentials = {
                username: 'mor_2314',
                password: 'senhaincorreta'
            };
            await p
                .spec()
                .post(`${baseUrl}/auth/login`)
                .withJson(credentials)
                .expectStatus(StatusCodes.UNAUTHORIZED);
        });
    });
});