# Oak logbook

Oak is a personal experiment to create a log book for taking daily or diary like
notes.

All other note taking software I have used falls massively short of what I want
from a note-taking application. Most offer fancy rich text editing, and maybe
some light tagging. I want something that can heavily self-reference itself, and
show all information about a topic you've logged about easily.

This is no where near done.

## Technologies

At the moment I intend for the note taking application to be entirely a
web-frontend. Once enough functionality has been developed I will figure out
some way of saving content to a server or local machine.

I'll be using the `contenteditable` attribute to create rich-text editing, and
generally taking advantage of as many modern web APIs as possible. I don't have
an intention at the moment to use an established framework such as Angular,
React or Vue.

## TODOs

These are just rough notes.

* Don't pass the result of `window.getSelection()` around. It's a global thing
  and nothing good is going to come of lots of things editing it with no contol.
  Pass a range around instead and make `Paper` determine if a change to
  selection is required.
* Add a modal when hyperlinking something so that we can actually link
  somewhere!
* Make the current date automatically be above where you're typing. Maybe change
  things so that typing produces `p` tags that have an attribute with the date
  in, and do something clever with that.
* Add in the ability to reference something else in the log. This will be the
  groundwork to the tag functionality.

## Ideas

### References

A core part of Oak should be self-reference. All complex functionality should
try to reuse the concept of referencing other things. For example, to introduce
tagging of arbitrary entries, those entries should 'reference' another part of
the log. This other part of the log can be a 'tag'. 

The tag exists in the log as text, rather than existing in some other location
tracked by the application.  This means we could for example create 'people'
structures and reference those if we have conversations or need to remember
something about somebody.

There will then be flexible ways of finding, editing, and searching these
references. For example making views that only contain things that reference
something.
