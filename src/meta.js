/**
 * Doviz.dev Meta
 * @link https://github.com/iamdual/doviz.dev
 * @author Ekin Karadeniz <iamdual@icloud.com>
 */

class Meta {
    /**
     * @param {string} base - Base currency code
     * @param {string} source - Source of the data
     * @param {string} updated_at - Update date of the data (optional)
     */
    constructor(base, source, updated_at) {
        this.base = base;
        this.source = source;
        this.created_at = new Date().toISOString();

        if (updated_at) {
            this.setUpdatedAt(updated_at);
        }
    }

    /**
     * @param {string} updated_at - Update date of the data
     */
    setUpdatedAt(updated_at) {
        this.updated_at = new Date(updated_at).toISOString();
    }
}

module.exports = Meta;
