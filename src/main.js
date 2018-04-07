import yeoman from 'yeoman-environment'
import path from 'path'
import proc from 'process'

const args = proc.argv.slice(2)

const env = yeoman.createEnv(args)
env.registerStub(require('./app'), 'create-react-native:app')
env.run(`create-react-native:app ${args}`)
