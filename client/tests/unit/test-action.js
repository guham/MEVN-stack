// https://vuex.vuejs.org/guide/testing.html#testing-actions
export default function testAction(action, payload, state, getters, expectedMutations, done) {
  let count = 0;

  // mock commit
  const commit = (type, payload) => {
    const mutation = expectedMutations[count];

    try {
      expect(type).toEqual(mutation.type);
      if (payload) {
        expect(payload).toEqual(mutation.payload);
      }
    } catch (error) {
      done(error);
    }

    count += 1;
    if (count >= expectedMutations.length) {
      done();
    }
  };

  // call the action with mocked store and arguments
  action({ commit, state, getters }, payload);

  // check if no mutations should have been dispatched
  if (expectedMutations.length === 0) {
    expect(count).toEqual(0);
    done();
  }
}
