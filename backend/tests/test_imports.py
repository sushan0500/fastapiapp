import unittest


class AppImportTests(unittest.TestCase):
    def test_backend_main_imports(self):
        import backend.main

        self.assertTrue(hasattr(backend.main, "app"))


if __name__ == "__main__":
    unittest.main()
