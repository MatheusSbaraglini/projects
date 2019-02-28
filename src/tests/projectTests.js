var chai = require('chai');
var server = require('../index');
var chaiHttp = require('chai-http');
var Project = require('../app/models/project');
var User = require('../app/models/user');
var Task = require('../app/models/task');
var should = chai.should();

// usa o chai como protocolo http
chai.use(chaiHttp);

var mochaAsync = (fn) => {
    return done => {
        fn.call().then(done, err => {
            done(err);
        });
    };
};

describe('API Project tests', function(){
    this.retries(3);

    const email = 'matheus@hotmail.com';
    var token, userId;
    var newUser = {
        name: "Matheus",
        email: email,
        password: "123"
    };

    beforeEach((done) => {
        User.deleteOne({}, (err) => {
            if (err){
                console.log(err);
                done(err);
            }

            done();
        });
    });

    after((done) => {
        Task.deleteMany({}, (err) => {
            if (err) {
                console.log(err);
                done(err);
            };

            Project.deleteMany({}, (err) => {
                if (err) {
                    console.log(err);
                    done(err);
                };

                done();
            });
        });
    });

    describe('/POST Project', () => {
        it('it should POST a new project', (done) => {    
            chai.request(server)
                .post('/auth/register')
                .send(newUser)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('user');
                    res.body.should.have.property('token');
                    res.body.user.name.should.be.equal('Matheus');

                    token = res.body.token;
                    userId = res.body.user._id;

                    let newProject = {
                        title: "New project test",
                        description: "Description test",
                        tasks: [
                            {title: "New task", assignedTo: userId},
                            {title: "Another task", assignedTo: userId}
                        ]
                    };

                    chai.request(server)
                        .post('/projects')
                        .send(newProject)
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json')
                        .set('Authorization', 'Bearer ' + token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            console.log('res: ' + res.body);
                            res.body.should.have.property('project');
                            res.body.project.should.have.property('description');
                            res.body.project.should.have.property('tasks');
                            res.body.project.tasks.should.have.length(2);
                            done();
                    });
            });
        });
    });

    describe('/GET Project', () => {
        it('it should GET a new project', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send(newUser)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('user');
                    res.body.should.have.property('token');
                    res.body.user.name.should.be.equal('Matheus');

                    token = res.body.token;
                    userId = res.body.user._id;

                    chai.request(server)
                        .get('/projects')
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json')
                        .set('Authorization', 'Bearer ' + token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('projects');
                            res.body.projects.should.have.length(1);
                            res.body.projects[0].should.have.property('title');
                            res.body.projects[0].should.have.property('description');
                            // res.body.projects.should.have.property('description');
                            // res.body.projects.should.have.property('tasks');
                            // res.body.projects.tasks.should.have.length(2);
                            done();
                    });
            });
        });
    });

    describe('/DELETE Project', () => {
        it('it should DELETE a new project', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send(newUser)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('user');
                    res.body.should.have.property('token');
                    res.body.user.name.should.be.equal('Matheus');

                    token = res.body.token;
                    userId = res.body.user._id;

                    let newProject = {
                        title: "New project test",
                        description: "Description test",
                        tasks: [
                            {title: "New task", assignedTo: userId},
                            {title: "Another task", assignedTo: userId}
                        ]
                    };

                    chai.request(server)
                        .post('/projects')
                        .send(newProject)
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json')
                        .set('Authorization', 'Bearer ' + token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            console.log('res: ' + res.body);
                            res.body.should.have.property('project');
                            res.body.project.should.have.property('_id');
                            res.body.project.should.have.property('description');
                            res.body.project.should.have.property('tasks');
                            res.body.project.tasks.should.have.length(2);
                            
                            let projectId = res.body.project._id;

                            chai.request(server)
                                .delete('/projects/' + projectId)
                                .set('Content-Type', 'application/json')
                                .set('Accept', 'application/json')
                                .set('Authorization', 'Bearer ' + token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    done();
                            });
                    });
            });
        });
    });

});