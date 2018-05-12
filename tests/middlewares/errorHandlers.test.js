const debug = require('debug')
const { errorHandler } = require('../../middlewares/errorHandlers')
// disable app logs
debug.disable()

describe('Test middleware error handlers', () => {
  // mocks
  const req = {}
  const res = {
    body: null,
    statusCode: null,
    status (code) {
      this.statusCode = code
      return this
    },
    send (body) {
      this.body = body
    },
    json (obj) {
      return this.send(obj)
    }
  }
  const next = jest.fn()
  next.mockClear()

  test('Should handle error', () => {
    errorHandler(new Error('Unexpected error'), req, res, next)

    expect(res.statusCode).toBe(500)
    expect(Object.keys(res.body).sort()).toEqual(
      ['type', 'message', 'error'].sort()
    )
    expect(res.body.type).toBe('Error')
    expect(res.body.message).toMatch(/.*/)
    expect(res.body.error).toMatchObject({})
  })

  describe('In development mode, "error" property is fulfilled with an error object', () => {
    let env
    beforeEach(() => {
      env = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
    })

    afterEach(() => {
      process.env.NODE_ENV = env
    })

    test('Should provide an error object', () => {
      errorHandler(new Error('Some error'), req, res, next)
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toHaveProperty('stack')
    })
  })
})
