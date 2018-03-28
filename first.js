import { mongo, Query } from './mocks/mongoSource';
import { Timer } from './mocks/timer';
import { Cursor } from './shared/cursor';
import { solrClient } from './mocks/solrDest';
import { Status } from './shared/status';

mongo.setCursor(Cursor);
async function syncDataToSolr(lastUpdated) {
    var query = new Query(lastUpdated);
    const cursor = mongo.dispatch(query);
    const timer = new Timer();
    timer.start();
    let count = 0;
    let completed, error, dateOfLastUpdated;
    try {
        while (await cursor.hasNext()) {
            const data = await cursor.readNext(100);
            const success = await solrClient.sendData(data);
            if (!success) {
                completed = false;
                break;
            } else {
                count += data.length;
                dateOfLastUpdated = data[data.length - 1].updatedDate;
            }
        }
    } catch (err) {
        completed = false;
        error = err;
    } finally {
        completed = completed !== false;
        timer.end();
    }

    return Status({
        count,
        dateOfLastUpdated,
        completed,
        error,
        timeElapsed: timer.elapsed
    });
}

syncDataToSolr(new Date(2018, 5, 21))
    .then(console.log)
    .catch(console.log);