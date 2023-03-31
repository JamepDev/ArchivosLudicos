const parseMD = require('parse-md').default;
const S = require('string');

const CONTENT_PATH = 'content/docs';

module.exports = function(grunt) {
  grunt.registerTask('build-index', () => {
    grunt.log.writeln('Construyendo indice JSON');

    var indexPages = () => {
      let index = [];

      grunt.file.recurse(CONTENT_PATH, function(abspath, rootdir, subdir, filename) {
        grunt.verbose.writeln('Parsing ', abspath);
        if (S(filename).endsWith(".md"))
          index.push(processFile(abspath, filename));
      });

      return index;
    };

    var processFile = (abspath, filename) => {
      let fcontents = grunt.file.read(abspath);
      let { metadata, content } = parseMD(fcontents);
      return {
        'filename': abspath,
        'metadata': metadata,
        'content': S(content).trim().stripTags().stripPunctuation().s,
      };
    };

    grunt.file.write('static/js/siteIndex.json', JSON.stringify(indexPages()));
    grunt.log.ok("Indice JSON generado correctamente");
  });
};
