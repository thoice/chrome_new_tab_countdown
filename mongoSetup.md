1) create db
2) create collection of items
3) create collection of counters
    db.createCollection('counters')
4) set initial state of counter
    db.counters.insert({_id:"itemid",seq:0})
5) add increment function
    function getNextSequence(MongoClient $mongo, $name) {
        $query = array('_id' => $name);
        $update = array('$inc' => array('seq' => 1));
        $fields = null;
        $options = array('new' => true);
        $ret = $mongo->selectCollection('apidb', 'counters')->findAndModify(
            $query, $update, $fields, $options
        );
       return $ret['seq'];
    }
6)

