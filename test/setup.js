require('dotenv').config()
const supertest = require('supertest')
process.env.TZ = 'UTC';

const { expect } = require('chai')

global.expect = expect;