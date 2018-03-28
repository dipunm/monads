import  { Tracker } from '../shared/monad-stuff';
class SolrClient {
    sendData(data) {
        const failed = (Math.random() * 100) > 96;
        return Promise.resolve(!failed);
    }
}
class MonadicSolrClient extends SolrClient {
    async sendData(data) {
        const success = await super.sendData();
        if(success) {
            return Tracker.RecordSuccess({
                count: data.length,
                dateOfLastUpdated: data[data.length - 1].updatedDate
            })
            // change the monad value without affecting internal state.
            .bind(() => Tracker.Lift(true));
        }else {
            return Tracker.Errored()
                // change the monad value without affecting internal state.
                .bind(() => Tracker.Lift(false));
        }
    }
}

export const solrClient = new SolrClient();
export const monadicSolrClient = new MonadicSolrClient();
