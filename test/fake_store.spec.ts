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
            p
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
                    image: { type: 'string' },
                }
            });
        });
    });
});