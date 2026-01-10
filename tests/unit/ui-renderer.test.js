// Assuming the test runner from customTestPlan.md is loaded first.
const { escapeHTML, renderTasks } = require('../concepts/uiRenderer.js');

describe('uiRenderer Concept', () => {

  it('escapeHTML pure function should sanitize special characters', () => {
    const maliciousInput = '<script>alert("xss")</script>';
    const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';
    assert.equals(escapeHTML(maliciousInput), expected, 'Should escape HTML tags and quotes');
  });

  it('renderTasks pure function should return a message for empty tasks', () => {
    const result = renderTasks([]);
    assert.equals(result, '<p>No tasks yet. Add one!</p>', 'Should show a message for no tasks');
  });

  // Test for XSS prevention as per the Secure Coding Checklist
  it('renderTasks pure function should sanitize task titles to prevent XSS', () => {
    const tasks = [
      { id: 1, title: 'A normal task', done: false },
      { id: 2, title: '<img src=x onerror=alert(1)>', done: false }
    ];

    const resultHTML = renderTasks(tasks);

    const expectedSafeTitle = '&lt;img src=x onerror=alert(1)&gt;';
    const isSafe = resultHTML.includes(expectedSafeTitle);
    const isUnsafe = resultHTML.includes('<img src=x onerror=alert(1)>');

    assert.isTrue(isSafe, 'The malicious string should be properly escaped');
    assert.isTrue(!isUnsafe, 'The raw malicious string should not be present in the HTML');
  });

});