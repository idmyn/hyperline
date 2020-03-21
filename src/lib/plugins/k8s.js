import { exec as ex } from 'child_process'
import React from 'react'
import Component from 'hyper/component'

export default class K8s extends Component {
  static displayName() {
    return 'k8s'
  }

  constructor(props) {
    super(props)

    this.state = { version: 'Not running' }
    this.setVersion = this.setVersion.bind(this)
  }

  setVersion() {
    exec('/usr/local/bin/docker version -f {{.Server.Version}}')
      .then(version => {
        this.setState({ version })
      })
      .catch(() => {
        this.setState({ version: 'not running' })
      })
  }

  componentDidMount() {
    this.setVersion()
    this.interval = setInterval(() => this.setVersion(), 15000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <div className='wrapper'>
        ☸️️ {this.state.version}

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
        reject(`${err}\n${stderr}`)
      } else {
        resolve(stdout)
      }
    })
  })
}
