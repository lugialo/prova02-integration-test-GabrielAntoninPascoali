import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { StatusCodes } from 'http-status-codes';

describe('DummyJSON API', () => {
    const p = pactum;
    const rep = SimpleReporter;
    const baseUrl = 'https://dummyjson.com';

    p.request.setDefaultTimeout(90000);

    beforeAll(async () => {
        p.reporter.add(rep);
    });

    describe('Produtos', () => {
        it('Retorna todos os produtos', async () => {
            await p
                .spec()
                .get(`${baseUrl}/products`)
                .expectStatus(StatusCodes.OK)
                .expectJsonSchema({
                    type: 'object',
                    properties: {
                        products: { type: 'array' },
                        total: { type: 'number' },
                        skip: { type: 'number' },
                        limit: { type: 'number' },
                    },
                });
        });

        it('Retorna um produto específico pelo ID', async () => {
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
                        category: { type: 'string' },
                    },
                });
        });

        it('Adiciona um novo produto', async () => {
            const newProduct = {
                title: 'Caneca do Batman',
                price: 15.99,
            };

            await p
                .spec()
                .post(`${baseUrl}/products/add`)
                .withHeaders('Content-Type', 'application/json')
                .withJson(newProduct)
                .expectStatus(StatusCodes.CREATED)
                .expectJsonSchema({
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        title: { type: 'string' },
                    }
                })
                .expectJson('title', newProduct.title);
        });

        it('Atualiza um produto existente', async () => {
            await p
                .spec()
                .put(`${baseUrl}/products/1`)
                .withHeaders('Content-Type', 'application/json')
                .withJson({
                    title: 'iPhone 15 Pro',
                    price: 1299.99,
                })
                .expectStatus(StatusCodes.OK)
                .expectJsonLike({
                    id: 1,
                    title: 'iPhone 15 Pro',
                });
        });

        it('Deleta um produto', async () => {
            await p
                .spec()
                .delete(`${baseUrl}/products/1`)
                .expectStatus(StatusCodes.OK)
                .expectJsonLike({
                    isDeleted: true,
                });
        });

        it('Busca por produtos com um termo', async () => {
            await p
                .spec()
                .get(`${baseUrl}/products/search`)
                .withQueryParams('q', 'phone')
                .expectStatus(StatusCodes.OK)
                .expectJsonSchema('products[0]', {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        title: { type: 'string' },
                    },
                });
        });

        it('Lista produtos de uma categoria específica', async () => {
            await p
                .spec()
                .get(`${baseUrl}/products/category/smartphones`)
                .expectStatus(StatusCodes.OK)
                .expectJsonSchema('products[0]', { 
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        title: { type: 'string' },
                        category: { type: 'string', enum: ['smartphones'] }
                    }
                });
        });
    });

    describe('Carrinhos', () => {
        it('Retorna os carrinhos de um usuário específico', async () => {
            await p
                .spec()
                .get(`${baseUrl}/carts/user/5`)
                .expectStatus(StatusCodes.OK)
                .expectJsonSchema({
                    type: 'object',
                    properties: {
                        carts: { type: 'array' },
                    },
                });
        });
    });

    describe('Posts', () => {
        it('Retorna todos os posts', async () => {
            await p
                .spec()
                .get(`${baseUrl}/posts`)
                .expectStatus(StatusCodes.OK)
                .expectJsonSchema({
                    type: 'object',
                    properties: {
                        posts: { type: 'array' },
                        total: { type: 'number' },
                    },
                });
        });

        it('Retorna os comentários de um post específico', async () => {
            await p
                .spec()
                .get(`${baseUrl}/posts/1/comments`)
                .expectStatus(StatusCodes.OK)
                .expectJsonSchema({
                    type: 'object',
                    properties: {
                        comments: { type: 'array' },
                        total: { type: 'number' },
                    },
                })
                .expectJsonLike('comments[0].postId', 1);
        });
    });
});