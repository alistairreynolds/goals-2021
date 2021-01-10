export const state = () => ({
  goals: []
})

export const mutations = {
  add (state, goalData) {
    state.goals.push(goalData)
  },
  set (state, goals) {
    state.goals = goals
  },
  update (state, updatedGoal) {
    const index = state.goals.findIndex(goal => updatedGoal.id === goal.id)
    state.goals[index] = updatedGoal
  },
  toggleGoalStatus (state, updatedGoal) {
    const index = state.goals.findIndex(goal => updatedGoal.id === goal.id)
    state.goals[index].completed = !updatedGoal.completed
  }
}

export const actions = {
  // Add a new goal
  store (vueContext, goalData) {
    return this.$axios
      .$post('goals.json', goalData)
      .then((r) => {
        vueContext.commit('add', { ...goalData, id: r.name })
      })
  },
  // Fetch goals on update
  nuxtServerInit (vueContext, context) {
    return context.$axios
      .$get('goals.json')
      .then((r) => {
        const goalsArray = []
        for (const key in r) {
          goalsArray.push({ ...r[key], id: key })
        }
        vueContext.commit('set', goalsArray)
      })
  },
  // Update goal data
  update (vueContext, goal) {
    return this.$axios
      // Update on the server
      .$put(`goals/${goal.id}.json`, goal)
      .then((_) => {
        // Then push the result to the state
        vueContext.commit('update', goal)
      })
  },
  // Change goal "completed" status
  toggleStatus (vueContext, goal) {
    // Call the mutator first so that we change its completed status
    vueContext.commit('toggleGoalStatus', goal)
    // Then dispatch the event to update it on firebase
    return this.$axios
      // Update on the server
      .$put(`goals/${goal.id}.json`, goal)
  }
}

export const getters = {
  forUser: state => (user) => {
    return state.goals.filter(goal => goal.user === user)
  },
  byId: state => (id) => {
    return state.goals.find(goal => goal.id === id)
  }
}
