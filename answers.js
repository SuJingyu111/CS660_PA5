cursor_r_1 = db.restaurants.find({name : "Caffe Dante"}, {_id: 0, restaurant_id: 1});
cursor_r_2 = db.restaurants.find({name : /.*Steak.*/}, {_id: 0, restaurant_id: 1, name: 1});
cursor_r_3 = db.restaurants.find({borough : "Brooklyn", cuisine: {$in:['Italian', 'American']}}, {name: 1});
cursor_r_4 = db.restaurants.aggregate([{$match: {cuisine: {$regex: /.*America.*/}}}, {$group: {_id: "$borough", count: {$count: {}}}}, {$sort: {count: -1}}]);
cursor_r_5 = db.restaurants.aggregate([{$match: {cuisine: 'Chinese', borough: 'Manhattan'}}, {$unwind: "$grades"}, {$group: {_id: "$restaurant_id", name: {$first: "$name"}, score: {$sum: "$grades.score"}}}, {$project: {_id: 0}}, {$sort: {score: -1}}, {$limit: 5}]);
cursor_r_6 = db.restaurants.find({"address.coord": {$geoWithin: {$box: [[-74, 40.5], [-73.5, 40.7]]}}, "grades": {$elemMatch: {score: {$gt: 70}}}}, {name:1, grades: 1, _id: 0});

cursor_z_1 = db.zips.aggregate([{$sort: {pop: -1}}, {$limit: 10}, {$project: {_id: 1, city: 1, state: 1}}]);
cursor_z_2 = db.zips.aggregate( [
    { $group:
       {
         _id: { state: "$state", city: "$city" },
         pop: { $sum: "$pop" }
       }
    },
    { $sort: { pop: 1 } },
    { $group:
       {
         _id : "$_id.state",
         city:  { $last: "$_id.city" },
       }
    }
 ] );
cursor_z_3 = db.zips.aggregate([{ $group: { _id: { state: "$state", city: "$city" }, pop: { $sum: "$pop" } } }, { $group: { _id: "$_id.state", avgPop: { $avg: "$pop" } } }, {$match: {avgPop: {$gt: 10000}}}]);
cursor_z_4 = db.zips.find({"loc": {$near: [-70, 40]}}, {_id: 0, city: 1}).limit(5);