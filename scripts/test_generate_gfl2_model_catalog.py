import unittest

from generate_gfl2_model_catalog import observations


class CatalogBookTests(unittest.TestCase):
    def test_catalog_requires_the_speaker_and_the_matching_drawn_role(self) -> None:
        roles = {"1163": ("瓦利亚", "绿区男孩")}
        appearance = ("瓦利亚", "", 0, True)
        for name, rows, expected in (
            ("matching speaker", [["Character", "绿区男孩"], ["Text", "1163", "绿区男孩"]], True),
            ("other speaker", [["Character", "绿区男孩"], ["Text", "1162", "绿区男孩"]], False),
            ("other role", [["Character", "绿区男孩"], ["Text", "1163", "白区男孩"]], False),
            ("portrait absent", [["Text", "1163", "绿区男孩"]], False),
        ):
            with self.subTest(name=name):
                book = {"importGridList": [{"rows": [{"strings": row} for row in rows]}]}
                self.assertEqual(appearance in list(observations(book, roles)), expected)
