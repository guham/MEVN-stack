// https://vuex.vuejs.org/guide/testing.html#testing-actions
// https://github.com/vuejs/vuex/issues/939
// Inspired in https://gitlab.com/gitlab-org/gitlab-ce/blob/master/spec/javascripts/helpers/vuex_action_helper.js

export default (
  action,
  payload,
  state,
  getters,
  expectedMutations,
  expectedActions,
  done,
) => {
  const mutations = [];
  const actions = [];

  // mock commit
  const commit = (type, mutationPayload) => {
    const mutation = { type };

    if (typeof mutationPayload !== 'undefined') {
      mutation.payload = mutationPayload;
    }

    mutations.push(mutation);
  };

  // mock dispatch
  const dispatch = (type, actionPayload) => {
    const dispatchedAction = { type };

    if (typeof actionPayload !== 'undefined') {
      dispatchedAction.payload = actionPayload;
    }

    actions.push(dispatchedAction);
  };

  const validateResults = () => {
    expect({
      mutations,
      actions,
    }).toEqual({
      mutations: expectedMutations,
      actions: expectedActions,
    });
    done();
  };

  const fn = typeof action === 'object' && typeof action.handler === 'function' ? action.handler : action;

  const result = Promise.resolve(fn(
    {
      commit,
      state,
      getters,
      dispatch,
      rootState: state,
      rootGetters: state,
    },
    payload,
  )).catch(error => error);

  return new Promise((resolve) => {
    setImmediate(resolve);
  })
    .then(() => result)
    .catch((error) => {
      validateResults();
      throw error;
    })
    .then((data) => {
      validateResults();
      return data;
    });
};
