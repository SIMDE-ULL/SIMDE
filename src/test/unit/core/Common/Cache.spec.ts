import { expect, beforeEach, test } from "vitest";
import { RandomCache, DirectCache } from "@/core/Common/Cache";
import { Memory } from "@/core/Common/Memory";

let memory: Memory;

beforeEach(() => {
  memory = new Memory(100);
});

test("DirectCache doesn't alter memory writes", (t) => {
  const directCache = new DirectCache(10, 100);
  const randomPosition = Math.floor(Math.random() * 100);

  // proxy the memory
  memory.getData = new Proxy(memory.getData, directCache.getHandler);
  memory.setData = new Proxy(memory.setData, directCache.setHandler);

  // write to the memory
  memory.setData(randomPosition, 10);

  expect(memory.getData(randomPosition)).toBe(10);
  // now the cache sould have the writen block loaded, so the previus read should be successful
  expect(directCache.success).toBe(true);
});

test("RandomCache faults the random percentage and returns the memory data", (t) => {
  const randomCache = new RandomCache(0.5);

  // fill memory with random data
  for (let i = 0; i < 100; i++) {
    memory.setData(i, i);
  }

  // proxy the memory
  memory.getData = new Proxy(memory.getData, randomCache.getHandler);
  memory.setData = new Proxy(memory.setData, randomCache.setHandler);

  // test reads 1000 times
  let faults = 0;
  for (let i = 0; i < 1000; i++) {
    const randomPosition = Math.floor(Math.random() * 100);
    const result = memory.getData(randomPosition);
    if (result instanceof Error) {
      throw result;
    }
    expect(result).toBe(memory.getData(randomPosition));
    if (!randomCache.success) {
      faults++;
    }
  }

  // check that the faults are around 50%, with a margin of 10%
  expect(faults).toBeGreaterThan(400);
  expect(faults).toBeLessThan(600);
});

test("DirectCache with one big block the same length as memory never faults and returns the memory data", (t) => {
  const directCache = new DirectCache(1, 100);

  // fill memory with random data
  for (let i = 0; i < 100; i++) {
    memory.setData(i, i);
  }

  // proxy the memory
  memory.getData = new Proxy(memory.getData, directCache.getHandler);
  memory.setData = new Proxy(memory.setData, directCache.setHandler);

  // read one position, wich should fail, as the block is not in the cache
  const randomPosition = Math.floor(Math.random() * 100);
  expect(memory.getData(randomPosition)).toBe(randomPosition);
  expect(directCache.success).toBe(false);

  // read all positions of memory
  for (let i = 0; i < 100; i++) {
    expect(memory.getData(i)).toBe(i);
    expect(directCache.success).toBe(true);
  }
});

test("DirectCache with as many blocks as positions should fail only on the first read", (t) => {
  const directCache = new DirectCache(100, 100);

  // proxy the memory
  memory.getData = new Proxy(memory.getData, directCache.getHandler);
  memory.setData = new Proxy(memory.setData, directCache.setHandler);

  // read all positions of memory, all should fail
  for (let i = 0; i < 100; i++) {
    memory.getData(i);
    expect(directCache.success).toBe(false);
  }

  // read all positions of memory, all should succeed
  for (let i = 0; i < 100; i++) {
    memory.getData(i);
    expect(directCache.success).toBe(true);
  }
});

test("DirectCache should always fault on reading alternatively from blocks with the same position", (t) => {
  // create a cache with one block and smaller than memory, so the first and last address will have a different block
  const directCache = new DirectCache(1, 10);

  // proxy the memory
  memory.getData = new Proxy(memory.getData, directCache.getHandler);
  memory.setData = new Proxy(memory.setData, directCache.setHandler);

  // alternatively read from the first and last address
  for (let i = 0; i < 10; i++) {
    memory.getData(0);
    expect(directCache.success).toBe(false);

    memory.getData(99);
    expect(directCache.success).toBe(false);
  }
});
