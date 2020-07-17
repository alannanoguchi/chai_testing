require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

const SAMPLE_OBJECT_ID = 'abcdefghi' 


describe('Message API endpoints', () => {
    beforeEach((done) => {
        // TODO: add any beforeEach code here
        const sampleMessage =  new Message({
            title: 'Sample Message',
            body: 'This is a sample message',
            author: 'Someone',
            _id: SAMPLE_OBJECT_ID
        })
        sampleMessage.save()
        .then(() => {
            done()
        })
    })
})

    afterEach((done) => {
        // TODO: add any afterEach code here
        Message.deleteMany({ title: ['Sample Message','anotherMessage']})
        .then(() => {
            done()
    })

    it('should load all messages', (done) => {
        // TODO: Complete this
        chai.request(app)
        .get('/messages')
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body.messages).to.be.an("string")
            done()
        })
    })

    it('should get one specific message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .get(`/messages/${SAMPLE_OBJECT_ID}`)
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body.title).to.equal('Sample Message')
            expect(res.body.author).to.equal('Sample')
            done()
        })
    })

    it('should post a new message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .post('/messages')
        .send({title: 'anotherMessage', body:'just another message'})
        .end((err, res) => {
            if (err) { done(err) }
            expect(res.body.message).to.be.an('object')
            expect(res.body.message).to.have.property('title', 'anotherMessage')
            
            // check that message is actually inserted into database
            Message.findOne({title: 'anotherMessage'}).then(message => {
                expect(message).to.be.an('object')
                done()
            })
        })
    })

    it('should update a message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .put(`/messages/${SAMPLE_OBJECT_ID}`)
        .send({title: 'anotherMessage'})
        .end((err, res) => {
            if (err) { done(err) }
            expect(res.body.message).to.be.an('object')
            expect(res.body.message).to.have.property('title', 'anotherMser')

            // check that message is actually inserted into database
            Messsage.findOne({title: 'anotherMessage'}).then(message => {
                expect(message).to.be.an('object')
                done()
            })
        })
    })

    it('should delete a message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .delete(`/messages/${SAMPLE_OBJECT_ID}`)
        .end((err, res) => {
            if (err) { done(err) }
            expect(res.body.message).to.equal('Successfully deleted.')
            expect(res.body._id).to.equal(SAMPLE_OBJECT_ID)

            // check that user is actually deleted from database
            User.findOne({title: 'anotherMessage'}).then(message => {
                expect(message).to.equal(null)
                done()
            })
        })
    })
})
