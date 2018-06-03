import { AsyncQueue } from 'utils/collections/async-queue';

import errorify from 'test-utils/errorify';

describe('AsyncQueue should implement an asynchronous task queue', () => {
  it('should collect the yielded values', async () => {
    const tasks = new AsyncQueue();

    tasks.enqueue(1);
    tasks.enqueue(2);
    tasks.enqueue(3);
    tasks.close();

    const result = [];

    for await (const task of tasks) {
      result.push(task);
    }

    expect(result).to.deep.equal([1, 2, 3]);
  });

  it('should await a task when requesting a task from an empty queue', () => {
    const tasks = new AsyncQueue();

    const result = Promise.all([tasks.next(), tasks.next()]);
    tasks.enqueue(2);
    tasks.enqueue(7);

    return result.then((yieldedTasks) => {
      const yieldedResults = yieldedTasks.map((task) => task.value);
      expect(yieldedResults).to.deep.equal([2, 7]);
    });
  });

  it('should receive an error when enqueueing an Error object', () => {
    const tasks = new AsyncQueue();

    tasks.enqueue(new Error('train caught fire'));

    const result = errorify(tasks.next());

    return result.catch((error) => {
      expect(error.message).to.equal('train caught fire');
    });
  });

  it('should receive an error when awaiting an Error object', () => {
    const tasks = new AsyncQueue();

    const result = errorify(Promise.resolve(tasks.next()));
    tasks.enqueue(new Error('she bit the apple'));

    return result.catch((yieldedTask) => {
      expect(yieldedTask.message).to.equal('she bit the apple');
    });
  });

  it('should receive an error when enqueueing a task onto a closed queue', () => {
    const tasks = new AsyncQueue();

    tasks.enqueue(1);
    tasks.enqueue(2);
    tasks.close();

    let errorOccurred = false;

    try {
      tasks.enqueue(3);
    } catch (error) {
      errorOccurred = true;

      expect(error.message).to.equal('unable to enqueue a task onto a closed queue');
    }

    expect(errorOccurred).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it('should receive a done signal when awaiting a task from a queue that got closed', () => {
    const tasks = new AsyncQueue();

    const result = Promise.resolve(tasks.next());
    tasks.close();

    return result.then(({ done }) => expect(done).to.be.true);
  });
});
