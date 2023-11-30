import { expect, beforeEach, test } from 'vitest'
import { Queue } from '../../../../core/Collections/Queue';

test('Queue size behaces as expected', (t) => {
   let queue = new Queue<number>(3);

   queue.add(1);
   queue.add(2);
   queue.add(3);

   // Size should be fixed to 3 + 1
   expect(queue.size).toBe( 4);
});

test('Queue has fixed size', (t) => {
   let queue = new Queue<number>(1);

   queue.add(1);
   queue.add(2);
   queue.add(3);

   // Size should be 1 + 1
   expect(queue.size).toBe( 2);
});

test('Queue does not let you add extra elements', (t) => {
   let queue = new Queue<number>(3);

   queue.add(1);
   queue.add(2);
   queue.add(3);

   // Size should be 3 + 1
   expect(queue.add(3)).toBe( -1);
});

test('Queue keeps its size after removing elements', (t) => {
   let queue = new Queue<number>(3);

   queue.add(1);
   queue.add(2);
   queue.add(3);

   queue.remove(1);

   expect(queue.size).toBe( 4);
});

test('Queue standard behavior', (t) => {
   let queue = new Queue<number>(3);

   let index = queue.add(1);
   expect(index).toBe( 0);
});

test('Queue behavior', (t) => {
   let queue = new Queue<number>(2);

   queue.add(1);
   queue.add(2);
   queue.remove(0);

   queue.add(3);
   queue.remove();
   expect(queue.top()).toBe( 3);
});
