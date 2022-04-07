import {expect, test} from '@oclif/test'

describe('query-connections-to', () => {
  test
  .stdout()
  .command(['query-connections-to'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['query-connections-to', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
