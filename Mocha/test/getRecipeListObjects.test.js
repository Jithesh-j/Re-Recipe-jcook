var chai = require('chai');
var chaiHttp = require('chai-http');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);

describe('Test Get Recipe Object List', function () {

    var requestResult;
    var response;

    before(function (done) {
        chai.request("http://localhost:8080")
            .get("/app/discover")  
            .end(function (err, res) {
                requestResult = res.body;
                response = res;
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

    // 1. Make sure response is an array with 2+ recipes 
    it('Should return an array object with more than 2 recipes', function () {
        expect(response).to.have.status(200);
        expect(response.body).to.have.length.above(2);
    });

    // 2. Make sure first index has the right properties 
    it('The first entry in the array has known properties', function () {
        // Check if the first recipe has the expected properties
        expect(requestResult[0]).to.include.keys('recipe_ID', 'recipe_name', 'meal_category', 'recipe_versions', 'image_url', 'is_visible');
        expect(requestResult[0]).to.have.property('_id');
        expect(requestResult[0].recipe_versions[0]).to.have.property('cooking_duration');
    });
    
    // 3. Check the rest 
    it('The elements in the array have the expected properties', function () {
        expect(response.body).to.satisfy(function (body) {
            for (var i = 0; i < body.length; i++) {
                // Ensure each recipe has all the necessary properties
                expect(body[i]).to.have.property('recipe_ID');
                expect(body[i]).to.have.property('recipe_name');
                expect(body[i]).to.have.property('meal_category');
                expect(body[i]).to.have.property('recipe_versions');
                expect(body[i]).to.have.property('image_url');
                expect(body[i]).to.have.property('is_visible').that.is.a('boolean');
                
                // Ensure each version of the recipe has the expected fields
                expect(body[i].recipe_versions[0]).to.have.property('cooking_duration').that.is.a('number');
                expect(body[i].recipe_versions[0]).to.have.property('ingredients').that.is.an('array');
                expect(body[i].recipe_versions[0]).to.have.property('directions').that.is.an('array');
            }
            return true;
        });
    });

});