(function () {
    //https://github.com/d3/d3-random
   


    const groups=[
        ["f","16-34"],
        ["f","35-44"],
        ["f","45-64"],
        ["f","65+"],
        ["m","16-34"],
        ["m","35-44"],
        ["m","45-64"],
        ["m","65+"],
        ]
    const schema=2
    const month=10
    const perception_bias = 1
    const bAttitude = 1
    const bPBC = 1
    const bNorms = 1
    const optimumSchema = 0

    //https://github.com/d3/d3-random
    const rndSchema = d3.randomInt(schema)
    const rnd = d3.randomUniform(1)
    const rndGroup = d3.randomInt(groups.length)
    const rndAge = function(){
        return groups[rndGroup()][1]
    }
    const rndGender = function(){
        return groups[rndGroup()][0]
    }
    function ZeroArray(size){
        array = Array(size)
        for(var i =0;i<size;i++){
            array[i]=0
        }
        return array
    }


    


    function Person(gender, age) {
        this.gender = gender;
        this.age = age;
        this.currentEatingHistory = Array(month);
        this.eatingHistory = [];
        this.prevalence= ZeroArray(schema); 
        this.desire= ZeroArray(schema); 
        this.automaticity=rnd()*0.1;
        this.autonomy=rnd();
        //   "descriptiveNorm": [0.0 for _ in range(schema)],
        //   "norms" : [0.0 for _ in range(schema)],
        //   "attitudes" : [0.0 for _ in range(schema)],
        //   "intention": [0.0 for _ in range(schema)],
        //   "perceivedBehaviouralControl": [0.0 for _ in range(schema)]
    }
    Person.prototype.init = function(){
        for( var i=0;i<month;i++){
            eatingSchema = rndSchema()
            this.currentEatingHistory[i]=eatingSchema
            this.prevalence[eatingSchema]+=1
            this.desire[eatingSchema]+=1 
        }
    }

    function Population(size){
        function generateGroups(){
            dict={}
            for (let i = 0; i < groups.length; i++) {
                if (!( groups[i][0] in dict)){
                    dict[groups[i][0]]={}
                }
                for (let j = 0; j < groups[1].length; j++) {
                    if(!(groups[1][j] in dict[groups[i][0]])){
                        dict[groups[i][0]][groups[i][1]]={"descriptiveNormRaw":ZeroArray(schema),"descriptiveNorm":ZeroArray(schema),"weightedDescriptiveNorm":ZeroArray(schema)}
                    }
                }     
            }
            return dict
        }
        this.people = Array(size);
        for (let i = 0; i < this.people.length; i++) {
            this.people[i]=new Person(rndGender(),rndAge())
            this.people[i].init()
        }
        this.groups = generateGroups()
    }

    Population.prototype.normDescriptiveNormRaw = function (){
        for (const gender in this.groups) {
            for (const age in this.groups[gender]){
                var sum = 0
                for (let i = 0; i < this.groups[gender][age].descriptiveNormRaw.length; i++) {
                    sum+= this.groups[gender][age].descriptiveNormRaw[i];
                }
                for (let i = 0; i < array.length; i++) {
                    this.groups[gender][age].descriptiveNorm[i]=this.groups[gender][age].descriptiveNormRaw[i]/sum
                    this.groups[gender][age].descriptiveNormRaw[i]=0 /// clear for next iteration
                }
            }
        }
    }
    Population.prototype.calcWeightedDescriptiveNorm =  function(){
        const sumShared = groups.length/2+2
        for (const gender in this.groups) {
            for (const age in this.groups[gender]){
                for(var i=0; i<schema;i++){
                    this.groups[gender][age].weightedDescriptiveNorm[i]=0
                    for (const genderInner in this.groups) {
                        for (const ageInner in this.groups[genderInner]){
                            var weight = 0
                            if(age ==ageInner){
                                weight++;
                            }
                            if(gender == genderInner){
                                weight ++
                            }
                            this.groups[gender][age].weightedDescriptiveNorm[i]+=this.groups[genderInner][ageInner].descriptiveNorm[i]*weight    
                        }
                    }
                    this.groups[gender][age].weightedDescriptiveNorm[i]/=sumShared
                }
            }
        }
    }

    Population.prototype.updatePopulation=function(){
        for (let i = 0; i < this.people.length; i++) {
            const person = this.people[i]
            const gender = person.gender
            const age = person.age
            const group = this.groups[gender][age]
            for (let j = 0; j < person.currentEatingHistory.length; j++) {
                eat = person.currentEatingHistory[j];
                group.descriptiveNormRaw[eat]+=1   
            }
        }
    }

    Population.prototype.update = function(){
        this.updatePopulation()
        this.normDescriptiveNormRaw()
        this.calcWeightedDescriptiveNorm()
    }
    Population.prototype.toString = function(){
        // console.log(this.people.length);
        // for ( let i =0; i<this.people.length; i++){
        //     console.log(this.people[i]);
        // }
        for (const gender in this.groups) {
            for (const age in this.groups[gender]){
                var total = 0
                for(var i=0;i<schema;i++){
                    total+=this.groups[gender][age].weightedDescriptiveNorm[i]
                }
                console.log(this.groups[gender][age].weightedDescriptiveNorm,total);
            }
        }       
    }
    var test = new Population(50)
    test.update()
    test.calcWeightedDescriptiveNorm()
    test.toString()
}());