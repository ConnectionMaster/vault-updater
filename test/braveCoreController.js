/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

var tap = require('tap')
var _ = require('underscore')
var ctrl = require('../src/controllers/braveCore')

var query = {
  daily: 'true',
  weekly: 'true',
  monthly: 'true',
  version: '1.2.3',
  first: 'true',
  channel: 'dev',
  platform: 'winia32-bc'
}

var expected = {
  daily: true,
  weekly: true,
  monthly: true,
  version: '1.2.3',
  first: true,
  channel: 'dev',
  platform: 'winia32-bc',
  ref: 'none',
  woi: '2016-01-04',
  country_code: 'UNKNOWN'
}

tap.test('Brave Core Controller', async (t) => {
  var runtimeMock = {
    mongo: {
      models: {
        insertBraveCoreUsage: function (usage) {
          t.ok(_.isObject(usage), 'usage is an object')
          t.same(usage, expected, 'usage built correctly')
        }
      }
    }
  }
  var replyMock = {
    response: (obj) => {
      t.ok(obj.ts, 'timestamp returned')
      t.ok(obj.status === 'ok', 'status ok')
    }
  }
  var requestMock = {
    query: query,
    info: {
      remoteAddress: '1.1.1.1'
    },
    headers: {}
  }
  var endpoints = ctrl.setup(runtimeMock)
  await endpoints[0].config.handler(requestMock, replyMock)
  t.plan(4)
})
