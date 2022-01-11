import Datastore from 'nedb'
import path from 'path'
import {remote} from 'electron'

const db = {}
db.bullion = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/bullion.db')
})
db.wood = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/wood.db')
})
db.meat = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/meat.db')
})
db.energy = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/energy.db')
})

export default db
