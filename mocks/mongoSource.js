class MongoCursor {
    constructor(query) {
        this.max = query.max;
        this.date = query.startDate;
    }

    fetchSome() {
        const size = Math.round(Math.random() * 32 + 1);
        const data = [];
        for(var i = 0; i < size; i++){
            if(this.max <= 0) break;
            this.max--;

            data.push({
                id: i,
                updatedDate: this.date
            });

            this.date = new Date(this.date);
            this.date.setHours(this.date.getHours()+1);
        }
        return new Promise(resolve => setTimeout(resolve, 200)).then(_ => data);
    }
}

class Mongo {
    constructor(Cursor) {
        this.setCursor(Cursor);
    }

    setCursor(Cursor) {
        this.Cursor = Cursor;
    }

    dispatch(query) {
        if(!this.Cursor) throw new Error('no cursor type was set.');
        return new this.Cursor(new MongoCursor(query));
    }
}
export const mongo = new Mongo();
export class Query {
    constructor(startDate, max = 512) {
        this.startDate = startDate || new Date();
        this.max = max;
    }
}