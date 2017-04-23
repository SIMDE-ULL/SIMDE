import { test } from 'ava';
import { Queue } from '../core/collections/Queue';


test('Queue size behaces as expected', (t) => {
   let queue = new Queue<number>(3);

   queue.add(1);
   queue.add(2);
   queue.add(3);

   // Size should be fixed to 3 + 1
   t.is(queue.size, 4);
});

test('Queue has fixed size', (t) => {
   let queue = new Queue<number>();

   queue.add(1);
   queue.add(2);
   queue.add(3);

   // Size should be 3 + 1
   t.is(queue.size, 4);
});

test('Queue does not let you add extra elements', (t) => {
   let queue = new Queue<number>(3);

   queue.add(1);
   queue.add(2);
   queue.add(3);


   // Size should be 3 + 1
   let error = t.throws(() => queue.add(4));
   t.is(error, 'Queue is full');
});

test('Queue keeps its size after removing elements', (t) => {
   let queue = new Queue<number>(3);

   queue.add(1);
   queue.add(2);
   queue.add(3);

   queue.remove(1);

   t.is(queue.size, 4);
});

test('Queue standard behavior', (t) => {
   let queue = new Queue<number>(3);

   queue.add(1);
   t.is(queue.first, 1);
});