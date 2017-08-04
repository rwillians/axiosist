import test from 'ava'
import axiosist from '.'

test('should request', t =>
  axiosist((req, res) => res.end())
    .request({ url: '/' })
    .then(() => t.pass()))

test('should request the right method', t =>
  axiosist((req, res) => {
    t.is(req.method, 'POST')
    res.end()
  }).post('/'))

test('should request the right url', t =>
  axiosist((req, res) => {
    t.is(req.url, '/foo/bar?baz=qux')
    res.end()
  }).request({
    baseURL: '/foo',
    url: '/bar',
    params: { baz: 'qux' }
  }))

test('should request the right header', t =>
  axiosist((req, res) => {
    t.is(req.headers.foo, 'bar')
    res.end()
  }).request({
    url: '/',
    headers: { foo: 'bar' }
  }))

test('should request the right body', t =>
  axiosist((req, res) => {
    req.setEncoding('utf8')
    req
      .on('data', chunk => t.is(chunk, 'foo'))
      .on('end', () => res.end())
  }).request({
    method: 'post',
    url: '/',
    data: 'foo'
  }))

test('should request the right host', t =>
  axiosist((req, res) => {
    t.is(req.headers.host, 'example.com')
    res.end()
  }).request({
    url: 'http://example.com/foo'
  }))

test('should response the right status', t =>
  axiosist((req, res) => {
    res.statusCode = 400
    res.statusMessage = 'FOO'
    res.end()
  }).request({ url: '/' }).catch(error => {
    t.is(error.response.status, 400)
    t.is(error.response.statusText, 'FOO')
  }))

test('should response the right header', t =>
  axiosist((req, res) => {
    res.setHeader('foo', 'bar')
    res.end()
  }).request({ url: '/' }).then(response => {
    t.is(response.headers.foo, 'bar')
  }))

test('should response the right body', t =>
  axiosist((req, res) => {
    res.end('foo')
  }).request({ url: '/' }).then(response => {
    t.is(response.data, 'foo')
  }))
