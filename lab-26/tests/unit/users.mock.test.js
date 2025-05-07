const sinon      = require('sinon');
const db         = require('../../src/database');
const userRoutes = require('../../src/routes/users');

describe('Mocked DB calls', () => {
  afterEach(() => sinon.restore());

  it('mocks fetching users', async () => {
    const fake = [{ id: 1, name: 'Test', email: 'test@example.com' }];
    sinon.stub(db, 'query').resolves({ rows: fake });

    const req = {};
    const res = { json: sinon.spy(), status: () => res };
    await userRoutes.handle(req, res);

    sinon.assert.calledWith(res.json, fake);
  });
});