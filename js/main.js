(function () {
    //https://github.com/d3/d3-random
   


    const groups=[
        ["f","upper"],
        ["f","lower"],
        ["m","upper"],
        ["m","lower"],
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

    function nomalise(array){
        var sum = 0
        for (let i = 0; i < array.length; i++) {
            sum+= array[i];
        }
        for (let i = 0; i < array.length; i++) {
            array[i] =  array[i]/sum;
        }
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
                        dict[groups[i][0]][groups[i][1]]={"raw":ZeroArray(schema),"descriptiveNorm":ZeroArray(schema),"weightedDescriptiveNorm":ZeroArray(schema)}
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
    Population.prototype.update = function(){
        for (let i = 0; i < this.people.length; i++) {
            const person = this.people[i]
            const gender = person.gender
            const age = person.age
            const group = this.groups[gender][age]
            for (let j = 0; j < person.currentEatingHistory.length; j++) {
                eat = person.currentEatingHistory[j];
                group.raw[eat]+=1   
            }
            nomalise(group.raw)
        }
        for (const gender in this.groups) {
            for (const age in this.groups[gender]){
                console.log(gender,age,this.groups[gender][age].raw);
            }
        }
    }
    Population.prototype.toString = function(){
        console.log(this.people.length);
        for ( let i =0; i<this.people.length; i++){
            console.log(this.people[i]);
        }
    }
    var test = new Population(50)
    test.update()
}());