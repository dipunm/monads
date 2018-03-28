import { mongo, Query } from './mocks/mongoSource';
import { monadicSolrClient as solrClient } from './mocks/solrDest';
import { Timer } from './mocks/timer';
import { MonadicCursor } from './shared/cursor'
import { runMonadic, Tracker } from './shared/monad-stuff';

mongo.setCursor(MonadicCursor);

async function* syncDataToSolr(lastUpdated) {
    var query = new Query(lastUpdated);
    const cursor = mongo.dispatch(query);
    yield Tracker.startTimer();
    while (await cursor.hasNext()) {
        const data = yield await cursor.readNext(100);
        yield await solrClient.sendData(data);
    }
    return Tracker.completeTimer();
}

runMonadic(syncDataToSolr, new Date(2018, 5, 21))
    .then(monad => console.log(monad.getStatus()))
    .catch(err => console.log(err));