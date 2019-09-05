// ensures a valid index is used, wraps around if needed
function validateIndex(i, MAX) {
    if(i <= 0)
        return 1;
    if(i >= MAX - 1)
        return MAX - 2;

    return i;
}

// swap ranks of index p1 with index p2
function swap(p1, p2, MAX) {
    p1 = validateIndex(p1, MAX);
    p2 = validateIndex(p2, MAX);

    if(p1 == p2)
        return;

    dbo.collection("names").findOne({rank: p1}, function(err, ar1) {
        dbo.collection("names").findOne({rank: p2}, function(err, ar2) {
        var temp = ar1.name
        ar1.name = ar2.name;
        ar2.name = temp;

        temp = ar1.id;
        ar1.id = ar2.id;
        ar2.id = temp;

        temp = ar1.complaints;
        ar1.complaints = ar2.complaints;
        ar2.complaints = temp;

        dbo.collection("names").updateOne(
                { rank: p1 },
                {$set:ar1},
                { upsert: true }
        );

        dbo.collection("names").updateOne(
                { rank: p2},
                {$set: ar2},
                { upsert: true }
        );
        });
    });
}

module.exports = {
    validateIndex,
    swap
}