// scripts/seed_conflicts.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true});
}

function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2), 'utf8');
}

// Configuració simple: 3 nodes, un post compartit amb ops conflictius
const base = path.resolve(process.cwd(), 'data');
const nodes = ['node1','node2','node3'];
const postId = 'post-conflict-1';

nodes.forEach(node => ensureDir(path.join(base,node)));

const initialPost = {
  id: postId,
  author: 'userA',
  content: { title: 'Festa del Poble', body: 'Ens veiem a la plaça', images: [] },
  hash: sha256Hex('Festa del Poble|Ens veiem a la plaça'),
  last_modified: new Date().toISOString(),
  _schema_version: 2
};

// Seed initial post to node1 only
writeJson(path.join(base,'node1','posts.json'), [initialPost]);
writeJson(path.join(base,'node1','ops.json'), [
  {
    op_id: 'op-create-initial',
    type: 'create',
    target_id: postId,
    origin_node: 'node1',
    timestamp: new Date().toISOString(),
    payload_hash: initialPost.hash,
    payload: initialPost.content
  }
]);

// Node2 and Node3 start from older snapshot or empty
writeJson(path.join(base,'node2','posts.json'), []);
writeJson(path.join(base,'node2','ops.json'), []);
writeJson(path.join(base,'node3','posts.json'), []);
writeJson(path.join(base,'node3','ops.json'), []);

// Create conflicting ops offline:
// Node2 adds image F2 to post
const imgF2 = { url: 'f2.jpg', hash: sha256Hex('f2.jpg') };
const opNode2 = {
  op_id: 'op-node2-addimg',
  type: 'update',
  target_id: postId,
  origin_node: 'node2',
  timestamp: new Date(Date.now() + 1000).toISOString(),
  payload_hash: sha256Hex(JSON.stringify({images:[imgF2]})),
  payload: { images: [imgF2] }
};
writeJson(path.join(base,'node2','op_queue.json'), [opNode2]);
writeJson(path.join(base,'node2','ops.json'), []);

// Node3 edits body and adds image F3
const imgF3 = { url: 'f3.jpg', hash: sha256Hex('f3.jpg') };
const opNode3 = {
  op_id: 'op-node3-edit-and-addimg',
  type: 'update',
  target_id: postId,
  origin_node: 'node3',
  timestamp: new Date(Date.now() + 2000).toISOString(),
  payload_hash: sha256Hex(JSON.stringify({body:'Canvi de text per node3', images:[imgF3]})),
  payload: { body: 'Canvi de text per node3', images: [imgF3] }
};
writeJson(path.join(base,'node3','op_queue.json'), [opNode3]);
writeJson(path.join(base,'node3','ops.json'), []);

console.log('Fixtures i ops conflictius sembrats a data/node1 node2 node3');
