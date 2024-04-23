import { expect, beforeEach, test } from "vitest";
import { NoCache, RandomCache, DirectCache } from "@/core/Common/Cache";
import { Memory } from "@/core/Common/Memory";

let memory: Memory;

beforeEach(() => {
  memory = new Memory(100);
});

test("NoCache, RandomCache and DirectCache always write to memory", (t) => {
  const noCache = new NoCache(memory);
  const randomCache = new RandomCache(memory, 0.5);
  const directCache = new DirectCache(memory, 10, 100);
  const randomPosition = Math.floor(Math.random() * 100);

  expect(noCache.setDatum(randomPosition, 10)).toBe(undefined);
  expect(randomCache.setDatum((randomPosition + 1) % 100, 11)).toBe(undefined);
  expect(directCache.setDatum((randomPosition + 2) % 100, 12)).toBe(undefined);

  expect(memory.getData(randomPosition)).toBe(10);
  expect(memory.getData((randomPosition + 1) % 100)).toBe(11);
  expect(memory.getData((randomPosition + 2) % 100)).toBe(12);
});

test("NoCache never faults and returns the memory data", (t) => {
  const noCache = new NoCache(memory);

  // fill memory with random data
  for (let i = 0; i < 100; i++) {
    memory.setData(i, i);
  }

  // test reads 100 times
  for (let i = 0; i < 100; i++) {
    const randomPosition = Math.floor(Math.random() * 100);
    expect(noCache.getFaultyDatum(randomPosition)).toEqual({
      value: memory.getData(randomPosition),
      got: true,
    });
  }
});

test("RandomCache faults the random percentage and returns the memory data", (t) => {
  const randomCache = new RandomCache(memory, 0.5);

  // fill memory with random data
  for (let i = 0; i < 100; i++) {
    memory.setData(i, i);
  }

  // test reads 1000 times
  let faults = 0;
  for (let i = 0; i < 1000; i++) {
    const randomPosition = Math.floor(Math.random() * 100);
    const result = randomCache.getFaultyDatum(randomPosition);
    if (result instanceof Error) {
      throw result;
    }
    expect(result.value).toBe(memory.getData(randomPosition));
    if (!result.got) {
      faults++;
    }
  }

  // check that the faults are around 50%, with a margin of 10%
  expect(faults).toBeGreaterThan(400);
  expect(faults).toBeLessThan(600);
});

test("DirectCache with one big block as memory never faults and returns the memory data", (t) => {
  const directCache = new DirectCache(memory, 1, 100);

  // fill memory with random data
  for (let i = 0; i < 100; i++) {
    memory.setData(i, i);
  }

  // read one position, wich should fail, as the block is not in the cache
  const randomPosition = Math.floor(Math.random() * 100);
  expect(directCache.getFaultyDatum(randomPosition)).toEqual({
    value: memory.getData(randomPosition),
    got: false,
  });

  // read all positions of memory
  for (let i = 0; i < 100; i++) {
    expect(directCache.getFaultyDatum(i)).toEqual({
      value: memory.getData(i),
      got: true,
    });
  }
});

test("DirectCache with as many blocks as positions should fail only on the first read", (t) => {
  const directCache = new DirectCache(memory, 100, 100);

  // read all positions of memory, all should fail
  for (let i = 0; i < 100; i++) {
    const result = directCache.getFaultyDatum(i);
    if (result instanceof Error) {
      throw result;
    }
    expect(result.got).toBe(false);
  }

  // read all positions of memory, all should succeed
  for (let i = 0; i < 100; i++) {
    const result = directCache.getFaultyDatum(i);
    if (result instanceof Error) {
      throw result;
    }
    expect(result.got).toBe(true);
  }
});

test("DirectCache should always fault on reading alternatively from blocks with the same position", (t) => {
  // create a cache with one block and smaller than memory, so the first and last address will have a different block
  const directCache = new DirectCache(memory, 1, 10);

  // alternatively read from the first and last address
  for (let i = 0; i < 10; i++) {
    const result = directCache.getFaultyDatum(0);
    if (result instanceof Error) {
      throw result;
    }
    expect(result.got).toBe(false);

    const result2 = directCache.getFaultyDatum(99);
    if (result2 instanceof Error) {
      throw result2;
    }
    expect(result2.got).toBe(false);
  }
});
