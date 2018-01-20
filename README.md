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

## Guiding principles

### Everything is DOM

All information for the log should be stored in the DOM of the log itself, as if
it was pencil and paper. Data can be hidden in attributes of elements, but
everything is in the DOM of the log. There should be no separate storage of
information. Some form of cache to speed up operations would be fine, but the
truth lies in the DOM.

### Referencing

Since everything will be in the DOM, information should be fairly accessible by
referencing other parts of the DOM.

For example, if basic tagging of entries was added to be able to tag things with
information like 'personal' or 'work', then these two tags should have a home in
the DOM (Everything is DOM), and be referenced in order to tag that location.

The tag, that exists in the DOM, can then have arbitrary DOM around it to allow
things like filtering all things with or without that tag, or deleting it and so
on.
