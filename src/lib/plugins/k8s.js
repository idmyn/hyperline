import { exec as ex } from 'child_process'
import React from 'react'
import Component from 'hyper/component'

export default class K8s extends Component {
  static displayName() {
    return 'k8s'
  }

  constructor(props) {
    super(props)

    this.state = { context: 'no context' }
    this.setContext = this.setContext.bind(this)
  }

  setContext() {
    exec('/usr/local/bin/kubectl config current-context')
      .then(context => {
        this.setState({ context })
      })
      .catch(() => {
        this.setState({ context: 'no context' })
      })
  }

  componentDidMount() {
    this.setContext()
    this.interval = setInterval(() => this.setContext(), 15000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <div className='wrapper'>
        <span className="icon">☸️️</span>{this.state.context}

        <style jsx>{`
          .wrapper {
            display: flex;
            align-items: center;
          }
        `}</style>
      </div>
    )
  }
}

function exec(command, options) {
  return new Promise((resolve, reject) => {
    ex(command, options, (err, stdout, stderr) => {
      if (err) {
        console.log(`${err}\n${stderr}`)
        reject(`${err}\n${stderr}`)
      } else {
        resolve(stdout)
      }
    })
  })
}
